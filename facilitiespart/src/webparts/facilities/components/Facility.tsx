import * as React from 'react'; 
import { 
  EnvironmentType 
} from '@microsoft/sp-core-library'; 
import styles from './Facilities.module.scss'; 
import { 
  IWebPartContext 
} from '@microsoft/sp-webpart-base';
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
import 
{ 
  DocumentCard, 
  DocumentCardPreview, 
  DocumentCardActivity, 
  DocumentCardTitle 
} from 'office-ui-fabric-react'; 
 
export interface IFacilityState { 
} 

export interface IFacilityProps { 
  context?: IWebPartContext; 
  item?: any; 
} 
export default class Facility extends React.Component<IFacilityProps, IFacilityState> { 
  constructor(props: { context : IWebPartContext }) 
  { 
    super(props); 
  } 
  public render(): JSX.Element { 
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
      </div> 
    ); 
  } 
} 
