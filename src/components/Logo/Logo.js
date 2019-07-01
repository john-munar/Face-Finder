import React from 'react';
import Tilt from 'react-tilt';
import faceIcon from './face-icon.png';
import './Logo.css';

function Logo() {
	return (
		<div className='ma4 mt0 back'>
			<Tilt className="Tilt br2 shadow-2" options={{ max : 45 }} style={{ height: 250, width: 250 }} >
 				<div className="Tilt-inner pa3" style={{justifyContent:'center'}}>
 					<img style = {{width:'80%'}}alt='logo' src={faceIcon}/>
 				</div>
			</Tilt>
		</div>
	);
}

export default Logo;