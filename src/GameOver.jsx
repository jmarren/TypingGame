import React, { useEffect, useState } from 'react';


function GameOver() {
    console.log('game over')

    return (
        <div>
            <div style={{ fontSize: '50px', zIndex: '100', position: 'absolute', top: '20%', width: '60%', transform: 'translate(-50%, -50%)' }}>
                Game Over!</div></div>
    )
}

export default GameOver;
