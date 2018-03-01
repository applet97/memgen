import React, { Component } from 'react';
import './App.css';

import { Link, Switch, Route} from 'react-router-dom'

import 'bootstrap/dist/css/bootstrap.css'

class Mem extends Component {
  render() {
    return (
      <div className="mem-photo row text-center col-md-12">
        <img src={this.props.mem_photo} className="mem-img" alt="mem"/>
      </div>
    );
  }
}

class MemContainer extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      text0: "",
      text1: "",
      original_photo: "https://i.imgflip.com/1ur9b0.jpg", // TODO: to place in props.params
      mem_photo: "https://i.imgflip.com/1ur9b0.jpg", // TODO: to copy from this.props.params.original_photo when willMount
      template_id: "112126428", // TODO: to place in props.params
    };
  }

  componentWillMount() {
    var index = this.props.match.params.index;
    var url = this.props.template_list[index - 1].url
    var id = this.props.template_list[index - 1].id
    
    this.setState(
      {
        mem_photo: url,
        original_photo: url,
        template_id: id,
      }
    );
  }

  buttonClicked(event) {
    // event.preventDefault();
    var params = {}
    params['template_id'] = this.state.template_id;
    params['text0'] = this.state.text0;
    params['text1'] = this.state.text1;
    params['username'] = "Erasyl";
    params['password'] = "Kbtu2016";

    var bodyParams = Object.keys(params).map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
    }).join('&');

    fetch('https://api.imgflip.com/caption_image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: bodyParams
    }).then(response => response.json()).then(body=>{
      this.setState({
        mem_photo: body.data.url,
      });
    });
  };

  upperTextChanged(event) {
    this.setState({
      text0: event.target.value
    });
  }

  lowerTextChanged(event) {
    this.setState({
      text1: event.target.value
    });
  }

  render() {
    return (
      <div className="mem-container">
        <div className="input-group input-text">
          <input className="form-control" placeholder="Upper text" name="text0" onChange={this.upperTextChanged.bind(this)}/>
          <input className="form-control" placeholder="Lower text" name="text1" onChange={this.lowerTextChanged.bind(this)}/>
          <button type="submit" onClick={this.buttonClicked.bind(this)}>Add caption</button>
        </div>
        
        <div className="mem_photo">
          <Mem mem_photo={this.state.mem_photo} />
        </div>
      </div>
    );
  }
}

class Template extends Component {
  render() {
    return (
      <div className="template-container">
        <img src={this.props.url} alt="memchik" className="template" />
      </div>
    );
  }
}

class TemplateContainer extends Component {

  render() {
    const templates = this.props.template_list;
    const templateNode = templates.map((template)=> {
      return (
        <Link to={"/create_meme/" + template.index}>
          <Template url={template.url}/>
        </Link>
      )
    });

    return (
      <div className="main">
        <div className="title"><h1 className="text-center">Welcome to MemeGenerator</h1></div>
        <div className="template-list-container">{templateNode}</div>
      </div>
    );
  }
}

class Main extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' render={(props) => (
          <TemplateContainer {...props} template_list={this.props.template_list} />
        )} />
        <Route path='/create_meme/:index' render={(props) => (<MemContainer {...props} template_list={this.props.template_list} />)}/>
      </Switch>
    )
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      template_list: [],
    }
  }

  componentWillMount() {
    fetch('https://api.imgflip.com/get_memes', {
      method: 'GET',
    }).then(response => response.json()).then(body=> {
      var list = body.data.memes;
      var templates = [];
      for (var i = 0; i < list.length; i++) {
        var cur = {}
        cur["id"] = list[i].id;
        cur["url"] = list[i].url;
        cur["name"] = list[i].name;
        cur["widht"] = list[i].width;
        cur["height"] = list[i].height;
        cur["index"] = i + 1;
        templates.push(cur);
      }
      
      this.setState({
        template_list: templates,
      });      
    });
  }

  render() {
    return (
      <div className="App">
        <Main template_list={this.state.template_list}/>
      </div>
    );
  }
}

export default App;
