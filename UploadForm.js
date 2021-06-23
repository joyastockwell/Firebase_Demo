//import React from 'react';

const UploadForm = () => {
    const changeHandler = (e) => {
        console.log("changed");
    }

    return React.createElement(
        'form',
        {inputType: 'file', onChange: changeHandler}
    );
}

export default UploadForm;