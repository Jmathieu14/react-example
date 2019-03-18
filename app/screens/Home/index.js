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
        // Get js reference to html element and change css
        // class name accordingly
        const tagE = document.getElementById(this._id);
        let myClassName = tagE.className;
        if (this.display === " hide") {
            this.display = " show";
            myClassName = myClassName.replace(" hide", " show");
        } else {
            this.display = " hide";
            myClassName = myClassName.replace(" show", " hide");
        }
        tagE.className = myClassName;
    }
    // set display to specific state
    setDisplay(newState) {
        // Get js reference to html element and change css
        // class name accordingly
        const tagE = document.getElementById(this._id);
        console.log(tagE);
        if (tagE !== null) {
            let myClassName = tagE.className;
            // Remove hide or show class tag
            myClassName = myClassName.substr(0, myClassName.length - 5);
            if (newState === " show") {
                this.display = " show";
                myClassName += " show";
            } else {
                this.display = " hide";
                myClassName += " hide";
            }
            tagE.className = myClassName;
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
    const returnArr = [];
    for (let z = 0; z < classList.length; ++z) {
        const childTag = classList[z];
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

// get hidden parent folders
function getHiddenParents(classList) {
    const returnArr = [];
    for (let z = 0; z < classList.length; ++z) {
        const myTag = classList[z];
        const myChildren = getImmediateChildren(myTag._id, classList);
        
        if (myChildren !== null && myTag.display === " hide") {
            returnArr.push(myTag._id);
        }
    }
    // If the returnArr is empty, return null
    if (returnArr === []) {
        return null;
    }
    return returnArr;
}

// Toggle display for each id that matches those in the classList
function toggleMatching(idList, classList) {
    for (let x = 0; x < idList.length; ++x) {
        for (let y = 0; y < classList.length; ++y) {
            if (idList[x] === classList[y]._id) {
                classList[y].toggleDisplay();
            }
        }
    }
}

// Folder component
class Folder extends React.Component {
    constructor(props) {
        super(props);
        this.tag = this.props.tag;
    }
    onTagSelectionChange = () => {
        this.tag.toggleDisplay();
        console.log(this.tag.display);
        this.render();
    }
    render() {
        return(
          <div id={this.tag._id} className={"folder"+this.tag.display} onClick={this.onTagSelectionChange} role="button">
            <div className="folder-title">
              {this.tag.name}
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
    // function that updates child tags/folders based on selection change
    onTagSelectionChange = () => {
        const hiddenParents = getHiddenParents(this.tags);
        if (hiddenParents !== null) {
            for (let i = 0; i < hiddenParents.length; ++i) {
                const myChildren = getImmediateChildren(hiddenParents[i], this.tags);
                if (myChildren !== null) {
                    toggleMatching(myChildren, this.tags);
                }
            }
        }
    }
    render() {
        // Map each folder name to a folder
        const folders = this.props.tags.map((tag) => 
          <Folder tag={tag} />);
        return(
          <div className="folderlist" onClick={this.onTagSelectionChange}>
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
    // Reset view to root folders
    backToRoot() {
        for (var x = 0; x < this.tags.length; ++x) {
            let myTag = this.tags[x];
            if (myTag.parentID === null) {
                myTag.setDisplay(" show");
            } else {
                myTag.setDisplay(" hide");
            }
        }
    }
    render() {
        return(
          <div className="tabber">
            <div className="tabber-title"> {this.props.name}
              <button onclick={this.backToRoot()} className="back-btn ">Back</button>
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
