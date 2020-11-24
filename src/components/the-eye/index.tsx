import React from 'react';
import './styles.scss';

export default function TheEye({ isActive = false }) {
	return <i className={`e-eye${isActive ? ' __active' : ''}`} />;
}
