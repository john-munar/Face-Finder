import React, {Component} from 'react';
import Navigation from './../components/Navigation/Navigation';
import Logo from './../components/Logo/Logo';
import ImageLinkForm from './../components/ImageLinkForm/ImageLinkForm';
import Rank from './../components/Rank/Rank';
import FaceDisplay from './../components/FaceDisplay/FaceDisplay';
import SignIn from './../components/SignIn/SignIn';
import Register from './../components/Register/Register';
import './App.css';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
 apiKey: '306dd2573e244d34b020ee1d376a3850'
});

const particleOptions = {
  particles: {
  	number: {
  		value: 20,
  		density: {
  			enable: true,
  			value_area: 300
  		}
  	}
 	}
}

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'signin',
  isSignedin: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }

  calculateFaceLocation = (data) => {
    const boundingPoints = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('imageDisplay')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: boundingPoints.left_col * width,
      topRow: boundingPoints.top_row * height,
      rightCol: width - (boundingPoints.right_col * width),
      bottomRow: height - (boundingPoints.bottom_row * height)
    }
  }

  displayBox = box => {
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onDetectSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => {
        if (response) {
          fetch('http://localhost:3001/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayBox(this.calculateFaceLocation(response));
      })
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    if (route === 'signin') {
      this.setState(initialState);
      this.setState({isSignedIn: false});
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
  return (
    <div>
    	<Particles 
    		className="particles"
        params={particleOptions}
      />
      <Navigation onRouteChange={this.onRouteChange} isSignedIn={this.state.isSignedIn}/>
      { this.state.route === 'home'
      ? <div>
          <Logo />
          {/*<h1> Face Finder </h1>*/}
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onDetectSubmit={this.onDetectSubmit} onInputChange={this.onInputChange}/>
          <FaceDisplay imageUrl={this.state.imageUrl} box={this.state.box}/>
        </div>
      : (
          this.state.route === 'signin'
          ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
        )
      }
  </div>
  );
}
}

export default App;
