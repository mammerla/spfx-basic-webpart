import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'facilitiesStrings';
import Facilities from './components/Facilities';
import { IFacilitiesProps } from './components/IFacilitiesProps';
import { IFacilitiesWebPartProps } from './IFacilitiesWebPartProps';

export default class FacilitiesWebPart extends BaseClientSideWebPart<IFacilitiesWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IFacilitiesProps > = React.createElement(
      Facilities,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
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
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
