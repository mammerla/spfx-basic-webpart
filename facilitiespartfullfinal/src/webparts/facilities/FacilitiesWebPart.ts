import * as React from 'react';
import * as ReactDom from 'react-dom';
import {
  BaseClientSideWebPart,
  IPropertyPaneSettings,
  IWebPartContext,
  PropertyPaneTextField,
  IPropertyPaneDropdownOption,
  PropertyPaneDropdown

} from '@microsoft/sp-client-preview';

import * as strings from 'facilitiesStrings';
import Facilities, { IFacilitiesProps } from './components/Facilities';
import { IFacilitiesWebPartProps } from './IFacilitiesWebPartProps';
import { ISPListList, ISPList } from './ISPListList';

import {
  EnvironmentType
} from '@microsoft/sp-client-base';


import MockListListHttpClient from './tests/MockListListHttpClient';

export default class FacilitiesWebPart extends BaseClientSideWebPart<IFacilitiesWebPartProps> {

  public constructor(context: IWebPartContext) {
    super(context);
  }

// Setup the Web Part Property Pane Dropdown options
  private _dropdownOptions: IPropertyPaneDropdownOption[] = [];
  public onInit<T>(): Promise<T> {
      this._getLists()
        .then((response) => {
          this._dropdownOptions = response.value.map((list: ISPList) => {
            return {
              key: list.Title,
              text: list.Title
          };
        });
      });
    return Promise.resolve();
  }
  // Retrieve Lists from SharePoint
  private _getLists(): Promise<ISPListList> {
    if (this.context.environment.type === EnvironmentType.Local) {
      return MockListListHttpClient.get(this.context.pageContext.web.absoluteUrl)
      .then((response) => {
         const listData: ISPListList = {
            value:
            [
                { Title: 'Mock List 1', Description: '1' },
                { Title: 'Mock List 2', Description: '2' },
                { Title: 'Mock List 3', Description: '3' },
                { Title: 'Mock List 4', Description: '4' }
            ]
            };
        return listData;
      });
    }
    else
    {
      return this.context.httpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists`)
        .then((response: Response) => {
        return response.json();
      });
    }
  }


  public render(): void {
    const element: React.ReactElement<IFacilitiesProps> = React.createElement(Facilities, {
      description: this.properties.description,
            context: this.context,
            list:this.properties.list
    });

    ReactDom.render(element, this.domElement);
  }

  protected get propertyPaneSettings(): IPropertyPaneSettings {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneDropdown('list', {
                  label: 'List',
                  options: this._dropdownOptions
                })

              ]
            }
          ]
        }
      ]
    };
  }
}
