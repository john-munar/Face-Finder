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

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
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
    console.log(box);
    this.setState({box: box})
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onDetectSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, this.state.input)
      .then(response => this.displayBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err))
  }

  onRouteChange = (route) => {
    console.log(route)
    this.setState({route: route});
  }

  render() {
  return (
    <div>
    	<Particles 
    		className="particles"
        params={particleOptions}
      />
      <Navigation onRouteChange={this.onRouteChange}/>
      { this.state.route === 'home'
      ? <div>
          <Logo />
          {/*<h1> Face Finder </h1>*/}
          <Rank />
          <ImageLinkForm onDetectSubmit={this.onDetectSubmit} onInputChange={this.onInputChange}/>
          <FaceDisplay imageUrl={this.state.imageUrl} box={this.state.box}/>
        </div>
      : (
          this.state.route === 'signin'
          ? <SignIn onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange}/>
        )
      }
  </div>
  );
}
}

export default App;
