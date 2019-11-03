import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Panel, Group, PanelHeader, List, Cell, platform, Search, Div} from '@vkontakte/vkui';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {IOS} from "@vkontakte/vkui/dist/es6";
import Icon20Info from '@vkontakte/icons/dist/20/info';


const osname = platform();





class SearchCities extends Component {

	constructor (props) {
		super(props);
		this.state = {
			showSearch: osname === IOS,
			search: ''
		};
		this.onChange = this.onChange.bind(this);

	}

	componentDidMount() {
		this.props.getCitiesList ()
	}



	onChange = (search) => {
		this.setState({ search });
		this.props.getCitiesList (search)
	};


	get сities () {
		const search = this.state.search.toLowerCase();
		return this.props.сities.filter(({title}) => title.toLowerCase().indexOf(search) > -1);
	}

	render() {
		let {id, go, fetchedUser, ...props} = this.props;
		return (
			<Panel id={id}>
				<PanelHeader>Выберите город</PanelHeader>
				<Group>
					<Search value={this.state.search} onChange={this.onChange}/>
					{this.props.сities.length > 0 &&
					<List>
						{this.сities.map((сities) => <Cell
							onClick={() => {
								props.сhangeCities(сities.title);
								props.setActivePanel("home")
							}}
							asideContent={props.field5 === сities.title ? <Icon24Done fill="var(--accent)"/> : null}
							key={сities.id}
						>
							{сities.title}
						</Cell>)}
					</List>
					}
				</Group>
				<Group>
					<Div>
						<Icon20Info fill="#0099ff" className='inline-block'/> <span className='inline-block'>Используйте поиск, если вашего города нет в списке.</span>
					</Div>
				</Group>

			</Panel>)
	}
}


SearchCities.propTypes = {
	id: PropTypes.string.isRequired,
	go: PropTypes.func.isRequired,
	field5: PropTypes.string.isRequired,
	setActivePanel: PropTypes.func.isRequired,
	сhangeCities: PropTypes.func.isRequired,
};

export default SearchCities;
