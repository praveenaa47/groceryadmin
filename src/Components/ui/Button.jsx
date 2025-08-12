import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const Button = ({
  type = 'button',
  onClick,
  className = '',
  children,
  fullWidth = false,
  variant = 'yellow',
  icon: Icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseStyle =
    'font-semibold px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2';

  const variants = {
    yellow: 'bg-yellow-400 hover:bg-yellow-500 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
    neutral: 'bg-gray-200 hover:bg-gray-300 text-black',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        baseStyle,
        variants[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {iconPosition === 'left' && Icon && <Icon className="w-5 h-5" />}
      {children}
      {iconPosition === 'right' && Icon && <Icon className="w-5 h-5" />}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  onClick: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  fullWidth: PropTypes.bool,
  variant: PropTypes.oneOf(['yellow', 'primary', 'danger', 'neutral']),
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;
