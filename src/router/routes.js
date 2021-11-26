import React from 'react'
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Camera from '../view/Camera'

function routes() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Camera />}/>
            </Routes>
        </Router>
    )
}

export default routes
