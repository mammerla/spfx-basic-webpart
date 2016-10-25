This is a very basic SharePoint Framework part you can build live, by pasting in a few snippets into a default 
SharePoint Framework project.

## Outline

This is a paste-in-code demo where we'll show how easy it is to create a SharePoint Framework Part.  We'll build out 
a simple data reporting part and briefly summarize the various tools along the way, and then make it look great 
using Office Fabric React components -- all in about 20 lines of additional code.

## Before the Demo

Do everything to have SharePoint Framework installed. 
(http://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment) 

Do this to create a new project:

``	yo @microsoft/sharepoint ``

	Solution Name = "Facilities"	
	Web Part Name = "Facilities"
	Web Part Description = "Facilities description"
	What framework would you like to start with: React
	
After this is done, install Fabric React:

``	npm i office-ui-fabric-react --save ``

## Demo Script Part 1: A Basic Web Part

Paste this snippet at top of Facilities.tsx file.  

```
export interface IFacilitiesState
{
  items?: any[];
}
```

Add IFacilitiesState to the type definition (so: the line should read export default class Facilities extends 
React.Component<IFacilitiesProps, IFaclitiesState> {))

Paste in the snippet below (the constructor) above the render() line.  

```
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
```

Replace interior of render() call with the snippet below.

```
   return (
      <div className={styles.facilities}>
        <div>This is the <b>{this.props.description}</b> webpart.</div>
        <table>
          <tbody>
      {

        this.state.items.map(function(object, i)
        {
          return <tr><td><b>{object.name}</b></td><td>{object.status}</td></tr>;
        })
      }
          </tbody>
        </table>
      </div>
    );
```

Run gulp serve.  Gulp is a "live" build server that will do the work to build out a packed JavaScript file, run 
TSLint, and more.  It'll detect changes as you save them, so as you edit, a build is almost always ready to go.

So, once Gulp finds that my build is already ready to go, it will open up my browser to the SharePoint Workbench.  

SharePoint Workbench is a local, lightweight debugging tool that helps me debug and see web part changes quickly.  
It's got some nice tools as well for seeing changes in a mobile or tablet. 


## Demo Script Part 2: Add Office UI Fabric to make it look good

For the Facilities Part, we'll use some Fabric React components to my Framework Part, and also take advantage of 
Fabric Core, which provides responsive layout capabilities.

Add this snippet at the top of the file:

```
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
```

Replace IFacilitiesState definition with this snippet:

```
export interface IFacilitiesState
{
  items?: any[];
  selectedItem?: any;
}
```

Replace the render() line and on downward with this snippet:

```
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
```

You can see that Office Fabric provides semantics for doing responsive layout, so that the part will look good 
whether it's on a desktop or on mobile.  There is have a simple CommandBar for displaying some additional commands.  
Office Fabric React has a powerful DetailsList, which allows you to performantly display a high volume of data with 
great features like sorting and filtering. 

(NOTE: you will need to double click on city names to get them to show up.)

We're using a DocumentCard control to display more information about specific facilities.

Office Fabric React has a number of other components, for doing things like handle context menus, too.  Check them out
at https://dev.office.com/fabric
