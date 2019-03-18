import React, {Component} from 'react';

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

const my_folders = ["f1", "f2", "f3"];

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
