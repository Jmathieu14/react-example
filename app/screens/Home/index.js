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
        // Whether or not this folder/tag should be displayed
        this.display = " hide";
    }
    // add an ancestor to the list
    addAncestor(aID) {
        if (this.ancestors === null) {
            this.ancestors = [];
        }
        if (!this.ancestors.includes(aID)) {
            this.ancestors.push(aID);
        }
    }
    // set tag's parent
    setParent(pID) {
        if (pID !== null) {
            this.parent = pID;
            this.addAncestor(pID);          
        }
    }
    // toggle isFolder to true
    toggleToFolder() {
        this.isFolder = true;
    }
    // toggle isFolder to false (is simply a tag)
    toggleToTag() {
        this.isFolder = false;
    }
    // toggle display value of folder/tag
    toggleDisplay() {
        if (this.display === " hide") {
            this.display = " show";
        } else {
            this.display = " hide";
        }
    }
}

// Basic folder structure to interpret
const my_folders = [["f1", ["f1-1", "f1-2", ["f1-2-1"]]], "f2", "f3"];
// Readable format of folder structure, made of a list of tags
let completed_folders_arr = [];

// Given the list of tags, toggle the 'isFolder' parameter to true for the Tag with the matching ID
function toggleToFolderMatchingTagID(listOfTags, tID) {
    const cap = listOfTags.length;
    for (let y = 0; y < cap; ++y) {
        const myTag = listOfTags[y];
        if (myTag._id === tID) {
            myTag.toggleToFolder();
            break;
        }
    }
}

// Take the most basic representation of a folder
// structure and convert it to a list of Tags
function basicListToClassList(basicList, classList) {
    return basicListToClassListHelper(true, null, [], basicList, classList);
}

// Helper function for basicList to classList function
function basicListToClassListHelper(isRoot, parentID, ancestorsIDlist, basicList, classList) {
    const cap = basicList.length;
    if (parentID !== null) {
        toggleToFolderMatchingTagID(classList, parentID);
    }
    for (let x = 0; x < cap; ++x) {
        const item = basicList[x];
        if (typeof(item) !== "string") {
            classList = basicListToClassListHelper(false, parentID, ancestorsIDlist, item, classList);
        } else {
            let localPID = null;
            if (!isRoot) {
                localPID = parentID;
            }
            const itemProps = {"name":item,"ancestors":ancestorsIDlist};
            const itemAsTag = new Tag(itemProps);
            itemAsTag.setParent(localPID);
            classList.push(itemAsTag);
            if (x + 1 < cap && typeof(basicList[x + 1]) !== "string") {
                parentID = itemAsTag._id;
                ancestorsIDlist.push(itemAsTag._id);
            }
        }
    }
    return classList;
}

completed_folders_arr = basicListToClassList(my_folders, completed_folders_arr);

// Quickly set display values of completed Tag list
for (let i = 0; i < completed_folders_arr.length; ++i) {
    const myTag = completed_folders_arr[i];
    if (myTag.parent === undefined) {
        myTag.display = " show";
    }
}

// Show a quick preview of our tags list
console.log(completed_folders_arr);

// Get list of immediate children IDs of specified parent, if given 
// parent ID is indeed a parent and in the classList array
function getImmediateChildren(pID, classList) {
    let returnArr = [];
    for (let z = 0; z < classList.length; ++z) {
        childTag = classList[z];
        if (childTag.parent === pID) {
            returnArr.push(childTag._id);
        }
    }
    // If the returnArr is empty, return null
    if (returnArr === []) {
        return null;
    }
    return returnArr;
}

// Folder component
class Folder extends React.Component {
    constructor(props) {
        super(props);
        this.tag = this.props.tag;
    }
    fToggleDisplay = () => {
        this.tag.toggleDisplay();
    }
    render() {
        return(
          <div className={"folder"+this.tag.display}>
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
        this.folderE = React.createRef();
    }
    // function that changes selection based on given tag
    onTagSelectionChange = () => {
        this.folderE.current.fToggleDisplay();
    }
    render() {
        // Map each folder name to a folder
        const folders = this.props.tags.map((tag) => 
          <Folder ref={this.folderE} name={tag.name} display={tag.display} onClick={this.onTagSelectionChange} />);
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
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <section className="container home">
        <Tabber 
          name="Ye Tabber" tags={completed_folders_arr}
        />
      </section>
    );
  }
}

Home.contextTypes = {
  router: React.PropTypes.object.isRequired,
}
