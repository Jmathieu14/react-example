import React, {Component} from 'react';
// Initialize random unique ID generator
const uuidv4 = require('uuid/v4');

// Define class representing a tag
class Tag {
    constructor(my_props) {
        this._id = (uuidv4() + my_props.name);
        this.name = my_props.name;
        this.isFolder = false;
        this.parent = my_props.parent;
        this.ancestors = my_props.ancestors;
    }
    // add an ancestor to the list
    addAncestor(aID) {
        if (this.ancestors === null) {
            this.ancestors = [];
        }
        this.ancestors.push(aID);
    }
    // set tag's parent
    setParent(pID) {
        this.parent = pID;
        this.addAncestor(pID);
    }
    // toggle isFolder to true
    toggleToFolder() {
        this.isFolder = true;
    }
    // toggle isFolder to false (is simply a tag)
    toggleToTag() {
        this.isFolder = false;
    }
}

//const testProps = {"name":"test", "isFolder":true};

const my_folders = [["f1", ["f1-1", "f1-2"]], "f2", "f3"];

let completed_folders_arr = [];


// Given the list of tags, toggle the 'isFolder' parameter to true for the Tag with the matching ID
function toggleToFolderMatchingTagID(listOfTags, tID) {
    const cap = listOfTags.length;
    for (let y = 0; y < cap; ++y) {
        let myTag = listOfTags[y];
        if (myTag._id === tID) {
            myTag.toggleToFolder();
            break;
        }
    }
}

// Take the most basic representation of a folder
// structure and convert it to a list of Tags
function basicListToClassList(basicList, classList) {
    return basicListToClassListHelper(true, null, null, basicList, classList);
}

// Helper function for basicList to classList function
function basicListToClassListHelper(isRoot, parentID, ancestorsIDlist, basicList, classList) {
    const cap = basicList.length;
    if (parentID !== null) {
        toggleToFolderMatchingTagID(classList, parentID);
    }
    for (let x = 0; x < cap; ++x) {
        const item = basicList[x];
        console.log(item);
        console.log(typeof(item));
        if (typeof(item) !== "string") {
            if (typeof(item[0]) === "string") {
                return basicListToClassListHelper(false, parentID, ancestorsIDlist, item, classList);
            } else {
                console.log("Error in given basic folder list. Missing parent folder.");
                console.log("Error on " + toString(item))
            }
        } else {
            let localPID = null;
            if (!isRoot) {
                localPID = parentID;
            }
            const itemProps = {"name":item, "parent":localPID, "ancestors":ancestorsIDlist};
            const itemAsTag = new Tag(itemProps);
            classList.push(itemAsTag);
            parentID = itemAsTag._id;
        }
    }
    return classList;
}

completed_folders_arr = basicListToClassList(my_folders, completed_folders_arr);

console.log(completed_folders_arr);


// Folder component
class Folder extends React.Component {
    render() {
        return(
          <div className="folder">
            <div className="folder-title">
              {this.props.name}
            </div>
          </div>
        );
    }
}

// The folder list component
class FolderList extends React.Component {
  constructor(props) {
    super(props);
    this.tags = this.props.tags;
  }
    render() {
        // Map each folder name to a folder
        const folders = this.props.tags.map((tag) => 
          <Folder name={tag} />);
        return(
          <div className="folderlist">
            <div className="fl-title">Folder List</div>
            <ul>
              {folders}
            </ul>
          </div>                                
        );
    }
}


// The tabber component
class Tabber extends React.Component {
 constructor(props) {
    super(props);
    this.tags = this.props.tags;
  }
    render() {
        return(
          <div className="tabber">
            <div className="tabber-title"> {this.props.name}
            </div>
            <FolderList tags={this.props.tags} />
          </div>
        );
    }
}


// The main page
export default class Home extends Component {

  render() {
    console.log(my_folders);
    return (
      <section className="container home">
        <Tabber
          name="Ye Tabber" tags={my_folders}
        />
      </section>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
