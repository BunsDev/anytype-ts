import * as React from 'react';
import { I } from 'Lib';
import { Label, Button } from 'Component';
import { observer } from 'mobx-react';

interface Props extends I.ViewComponent {
	title: string;
	description: string;
	button: string;
	onClick: (e: any) => void;
};

const Empty = observer(class Empty extends React.Component<Props, {}> {

	render () {
		const { block, title, description, button, onClick } = this.props;

		return (
			<div id={[ 'dataviewEmpty', block.id ].join('-')} className="dataviewEmpty">
				<div className="inner">
					<Label className="name" text={title} />
					<Label className="descr" text={description} />
					<Button color="blank" className="c28" text={button} onClick={onClick} />
				</div>
			</div>
		);
	};

});

export default Empty;