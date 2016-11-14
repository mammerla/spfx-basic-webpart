import * as React from 'react';
import {
  EnvironmentType
} from '@microsoft/sp-client-base';
import styles from '../Facilities.module.scss';
import {
  IWebPartContext
} from '@microsoft/sp-client-preview';
import
{
  DocumentCard,
  DocumentCardPreview,
  DocumentCardActivity,
  DocumentCardTitle
} from 'office-ui-fabric-react';

import MockIssueListHttpClient from '../tests/MockIssueListHttpClient';
import { ISPIssueList } from '../ISPIssueList';
export interface IFacilityState {
  issues?: ISPIssueList;
}
export interface IFacilityProps {
  context?: IWebPartContext;
  item?: any;
  list?: string;
}


export default class Facility extends React.Component<IFacilityProps, IFacilityState> {
  constructor(props: { context : IWebPartContext })
  {
    super(props);
 this.state = { issues: null };
  }
  private lastList : string  = null;
  private lastItem : string = null;
  // Define and retrieve mock List data
  private _getMockListData(): Promise<ISPIssueList> {
    return MockIssueListHttpClient.get(this.props.context.pageContext.web.absoluteUrl).then(() => {
        const listData: ISPIssueList = {
            value:
            [
                { Title: 'Mock Issue 1', Description: '1' },
                { Title: 'Mock Issue 2', Description: '2' },
                { Title: 'Mock Issue 3', Description: '3' },
                { Title: 'Mock Issue 4', Description: '4' }
            ]
            };
        return listData;
    }) as Promise<ISPIssueList>;
  }
  // Retrieve List data from SharePoint
  private _getListData(): Promise<ISPIssueList> {
    return this.props.context.httpClient.get(this.props.context.pageContext.web.absoluteUrl + `/_api/web/lists/GetByTitle('` + this.props.list + `')/items?$filter=Facility eq '` + this.props.item.name + `'`)
      .then((response: Response) => {
      return response.json();
      });
  }
  // Call methods for List data retrieval
  private _retrieveListAsync(): void
  {
    const self = this;
    this.lastItem = this.props.item;
    this.lastList = this.props.list;
    // Mock List data
    if (this.props.context.environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        self.setState( {
          issues: response,
        });
      });
    }
    // Get Full List data
    else {
      this._getListData()
        .then((response) => {
          self.setState( {
            issues: response,
          });
      });
    }
  }
  public render(): JSX.Element {

    if (this.props.item != null && this.props.list != null && this.props.context != null
        && (this.props.item != this.lastItem || this.props.list != this.lastList))
    {
      this._retrieveListAsync();
    }

    return (
      <div>
        <DocumentCard>
          <DocumentCardTitle title={ this.props.item ? this.props.item.name : '' } />
          <DocumentCardPreview previewImages={ [
            this.props.item ?
            {
              previewImageSrc: "https://spawesome.blob.core.windows.net/facilities/" + this.props.item.name.toLowerCase() + ".jpg"
            } : ''
          ]}/>
          <DocumentCardActivity
            activity='Facility Manager'
            people={
                   this.props.item ?
                    [
                      {
                        name: this.props.item.facilitiesManagerName,
                        profileImageSrc: 'https://spawesome.blob.core.windows.net/resources/avatar-' + this.props.item.facilitiesManagerAlias + '.png'
                      }
                    ] : null
                  }
                />
        </DocumentCard>
            <div>{ this.props.list ? this.props.list : '(no list was selected.)' }</div>
        <table>
          <tbody>
            {
              this.state.issues ?
              this.state.issues.value.map(function(object, i) {
                return <tr><td><b>{object.Title}</b></td><td>{object.Description}</td></tr>;
              }) : ''
            }
          </tbody>
        </table>


      </div>
    );
  }
}
