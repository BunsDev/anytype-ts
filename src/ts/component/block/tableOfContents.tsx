import * as React from 'react';
import { I, focus, DataUtil, Util } from 'ts/lib';
import { blockStore } from 'ts/store';
import { observer } from 'mobx-react';

interface Props extends I.BlockComponent {};

const BlockTableOfContents = observer(class BlockTableOfContents extends React.Component<Props, {}> {

	_isMounted: boolean = false;

	constructor (props: any) {
		super(props);
		
		this.onKeyDown = this.onKeyDown.bind(this);
		this.onKeyUp = this.onKeyUp.bind(this);
		this.onFocus = this.onFocus.bind(this);
	};

	render () {
		const { block } = this.props;
		const cn = [ 'wrap', 'focusable', 'c' + block.id ];
		const tree = this.getTree();

		const Item = (item: any) => {
			return (
				<div 
					className="item" 
					onClick={(e: any) => { this.onClick(e, item.id); }}
					style={{ paddingLeft: item.depth * 24 }}
				>
					<span>{item.text}</span>
				</div>
			);
		};

		return (
			<div className={cn.join(' ')} tabIndex={0} onKeyDown={this.onKeyDown} onKeyUp={this.onKeyUp} onFocus={this.onFocus}>
				{!tree.length ? (
					<div className="empty">Add headings to create a table of contents</div>
				) : (
					<React.Fragment>
						{tree.map((item: any, i: number) => (
							<Item key={i} {...item} />
						))}
					</React.Fragment>
				)}
			</div>
		);
	};
	
	componentDidMount () {
		this._isMounted = true;
	};
	
	componentWillUnmount () {
		this._isMounted = false;
	};
	
	onKeyDown (e: any) {
		const { onKeyDown } = this.props;

		if (onKeyDown) {
			onKeyDown(e, '', [], { from: 0, to: 0 });
		};
	};
	
	onKeyUp (e: any) {
		const { onKeyUp } = this.props;

		if (onKeyUp) {
			onKeyUp(e, '', [], { from: 0, to: 0 });
		};
	};

	onFocus () {
		const { block } = this.props;
		focus.set(block.id, { from: 0, to: 0 });
	};

	getTree () {
		const { rootId } = this.props;
		const blocks = blockStore.unwrapTree([ blockStore.wrapTree(rootId, rootId) ]).filter((it: I.Block) => { return it.isTextHeader(); });
		const list: any[] = [];

		let depth = 0;

		for (let i = 0; i < blocks.length; i++) {
			let block = blocks[i];
			let next = blocks[i + 1];

			if (block.isTextHeader1()) {
				depth = 0;
			};

			list.push({ 
				depth, 
				id: block.id,
				text: String(block.content.text || DataUtil.defaultName('page')),
			});

			if (next) {
				if (block.isTextHeader1() && (next.isTextHeader2() || next.isTextHeader3())) {
					depth++;
				};
				if (block.isTextHeader2() && (next.isTextHeader3())) {
					depth++;
				};
				if (block.isTextHeader3()) {
					depth = 0;
				};
			};
		};

		return list;
	};

	onClick (e: any, id: string) {
		const { isPopup } = this.props;
		const node = $('.focusable.c' + id);

		if (!node.length) {
			return;
		};

		const container = Util.getScrollContainer(isPopup);
		const no = node.offset().top;
		const st = container.scrollTop();
		const hh = Util.sizeHeader();
		const y = Math.max(hh + 20, (isPopup ? (no - container.offset().top + st) : no) - hh - 20);

		container.scrollTop(y);
	};
	
});

export default BlockTableOfContents;