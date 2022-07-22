import React from 'react';
import BasicPage from './basic';
import FadeoutPage from './fadeout';
import AutoheightPage from './auto-height';
import AutowidthPage from './auto-width';
import AutoplayPage from './auto-play';
import StagePaddingPage from './stage-padding';
import Events from './events';
import CustomComponents from './custom-components';
import LazyLoadingPage from './lazy-loading';
import './styles.scss';

export default function getPageComponent(pageID = '') {
	if (pageID === 'basic') {
		return <BasicPage />;
	}
	if (pageID === 'auto-height') {
		return <AutoheightPage />;
	}
	if (pageID === 'auto-width') {
		return <AutowidthPage />;
	}
	if (pageID === 'auto-play') {
		return <AutoplayPage />;
	}
	if (pageID === 'fadeout') {
		return <FadeoutPage />;
	}
	if (pageID === 'stage-padding') {
		return <StagePaddingPage />;
	}
	if (pageID === 'events') {
		return <Events />;
	}
	if (pageID === 'custom-components') {
		return <CustomComponents />;
	}
	if (pageID === 'lazy-loading') {
		return <LazyLoadingPage />;
	}
	return null;
}
