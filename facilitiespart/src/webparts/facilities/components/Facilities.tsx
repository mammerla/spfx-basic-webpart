import * as React from 'react';
import { css } from 'office-ui-fabric-react';

import styles from '../Facilities.module.scss';
import { IFacilitiesWebPartProps } from '../IFacilitiesWebPartProps';

import
{
  CommandBar,
  Button,
  DetailsList,
  DocumentCard,
  DocumentCardPreview,
  DocumentCardActivity,
  DocumentCardTitle,
  Link,
  Image,
  ImageFit,
  IColumn
} from 'office-ui-fabric-react';


export interface IFacilitiesState
{
  items?: any[];
  selectedItem?: any;
}

export interface IFacilitiesProps extends IFacilitiesWebPartProps {
}

export default class Facilities extends React.Component<IFacilitiesProps, IFacilitiesState> {
    constructor(props: { description : string })
  {
    super(props);

    this.state = { items: new Array() };

    let self = this;

    fetch("https://spawesome.blob.core.windows.net/facilities/facilities.json",  { "credentials": "omit" } )
      .then((response) => response.json())
      .then((responseData) => {
          self.setState( {
                    items: responseData,
                });
      });
  }
  public render(): JSX.Element {
    return (
      <div className={styles.facilities}>
        <div className="ms-font-su">Facilities</div>
        <CommandBar items={
          [
            { name: "List", icon: "listGroup" },
            {name: "Map", icon: "mapMarker" }
          ] } >
        </CommandBar>

        <div className="ms-Grid">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-u-sm6 ms-u-md4 ms-u-lg6">
              <DetailsList    items={ this.state.items }
                              onItemInvoked={ (item, index) => this.setState( { selectedItem: item } ) }
                              onRenderItemColumn={ _renderItemColumn }
                              columns={
                                [
                                  {
                                    key: "status",
                                    name: "Status",
                                    fieldName: "status",
                                    minWidth: 60
                                  },
                                  {
                                    key: "name",
                                    name: "Name",
                                    fieldName: "name",
                                    minWidth: 300
                                  }
                                ] } />
            </div>
            <div className="ms-Grid-col ms-u-sm6 ms-u-md8 ms-u-lg6">
              <DocumentCard>
                <DocumentCardTitle title={ this.state.selectedItem ? this.state.selectedItem.name : '' } />
                <DocumentCardPreview previewImages={ [
                      this.state.selectedItem ?
                      {
                        previewImageSrc: "https://spawesome.blob.core.windows.net/facilities/" + this.state.selectedItem.name.toLowerCase() + ".jpg"
                      } : ''
                ]}/>
                <DocumentCardActivity
                  activity='Facility Manager'
                  people={
                   this.state.selectedItem ?
                    [
                      {
                        name: this.state.selectedItem.facilitiesManagerName,
                        profileImageSrc: 'https://spawesome.blob.core.windows.net/resources/avatar-' + this.state.selectedItem.facilitiesManagerAlias + '.png'
                      }
                    ] : null
                  }
                />
              </DocumentCard>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function _renderItemColumn(item, index, column)
{
  let fieldContent = item[column.fieldName];

  switch (column.key)
  {
    case 'status':
      return <div style={ { backgroundColor: fieldContent, borderRadius: "16px", width: "16px", marginLeft: "6px" } }>&nbsp;</div>;

    default:
      return <span>{ fieldContent }</span>;
  }
}
