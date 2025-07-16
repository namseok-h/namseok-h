import classNames from 'classnames';
import React from 'react';
import './scss/Button.scss';

const Button = (props) => {
    const {
        children,
        size = "medium",
        color = "blue",
        wsize = "basic",
        outline,
        ...rest
    } = props;

    return (
        <button
            className={classNames("Button", size, color, wsize, {outline})}
            {...rest}
        >
            {children}
        </button>
    );
};

export default Button;