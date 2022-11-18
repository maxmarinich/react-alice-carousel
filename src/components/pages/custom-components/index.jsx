"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var render_components_1 = require("./render-components");
var refs_components_1 = require("./refs-components");
var props_components_1 = require("./props-components");
var event_components_1 = require("./event-components");
var the_anchor_1 = require("../../the-anchor");
var CustomComponentsPage = function () {
    return (<section className="p-basic p-custom">
			<h2 className="title">
				<the_anchor_1.default {...(0, the_anchor_1.genAnchorProps)('custom-components')}/>
				&nbsp; Base
			</h2>
			<event_components_1.default />
			<br />
			<br />
			<br />
			<h2 className="title">
				<the_anchor_1.default {...(0, the_anchor_1.genAnchorProps)('custom-components-props')}/>
				&nbsp; Props
			</h2>
			<props_components_1.default />
			<br />
			<br />
			<br />
			<h2 className="title">
				<the_anchor_1.default {...(0, the_anchor_1.genAnchorProps)('custom-components-render')}/>
				&nbsp; Render functions
			</h2>
			<render_components_1.default />
			<br />
			<br />
			<br />
			<h2 className="title">
				<the_anchor_1.default {...(0, the_anchor_1.genAnchorProps)('custom-components-refs')}/>
				&nbsp; Refs
			</h2>
			<refs_components_1.default />
		</section>);
};
exports.default = CustomComponentsPage;
