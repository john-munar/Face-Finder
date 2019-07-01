import React from 'react';
import './FaceDisplay.css'
/* How does absolute mt2 even work */
function FaceDisplay({imageUrl, box}) {
	return(
		<div className='center'>
			<div className='absolute mt2'> 
				<img id='imageDisplay' alt='' src={imageUrl} width='500px' height='auto'/>
				<div className='bounding-box' style={{top: box.topRow, right: box.rightCol, bottom: box.bottomRow, left: box.leftCol}}> </div>
			</div>
		</div>
	);
}

export default FaceDisplay;