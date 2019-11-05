import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Panel, Group, PanelHeader, List, Cell, platform, Search, FixedLayout} from '@vkontakte/vkui';
import Icon24Done from '@vkontakte/icons/dist/24/done';
import {IOS} from "@vkontakte/vkui/dist/es6";


const osname = platform();

class SearchMark extends Component {
	constructor (props) {
		super(props);
		this.state = {
			showSearch: osname === IOS,
			search: '',
			autoMark: [
				{id: 1, "name": "Alfa Romeo"},
				{id: 2, "name": "Audi"},
				{id: 3, "name": "BMW"},
				{id: 4, "name": "Cadillac"},
				{id: 5, "name": "Chery"},
				{id: 6, "name": "Chevrolet"},
				{id: 7, "name": "Chrysler"},
				{id: 8, "name": "Citroen"},
				{id: 9, "name": "Daewoo"},
				{id: 10, "name": "Daihatsu"},
				{id: 11, "name": "Fiat"},
				{id: 12, "name": "Ford"},
				{id: 13, "name": "Geely"},
				{id: 14, "name": "Great Wall"},
				{id: 15, "name": "Honda"},
				{id: 16, "name": "Hummer"},
				{id: 17, "name": "Hyundai"},
				{id: 18, "name": "Infiniti"},
				{id: 19, "name": "Isuzu"},
				{id: 20, "name": "Jaguar"},
				{id: 21, "name": "Jeep"},
				{id: 22, "name": "Kia"},
				{id: 23, "name": "Land Rover"},
				{id: 24, "name": "Lexus"},
				{id: 25, "name": "Lifan"},
				{id: 26, "name": "Lincoln"},
				{id: 27, "name": "Mazda"},
				{id: 28, "name": "Mercedes-Benz"},
				{id: 29, "name": "Mini"},
				{id: 30, "name": "Mitsubishi"},
				{id: 31, "name": "Nissan"},
				{id: 32, "name": "Opel"},
				{id: 33, "name": "Peugeot"},
				{id: 34, "name": "Pontiac"},
				{id: 35, "name": "Renault"},
				{id: 36, "name": "Saab"},
				{id: 37, "name": "SEAT"},
				{id: 38, "name": "Skoda"},
				{id: 39, "name": "Smart"},
				{id: 40, "name": "SsangYong"},
				{id: 41, "name": "Subaru"},
				{id: 42, "name": "Suzuki"},
				{id: 43, "name": "Toyota"},
				{id: 44, "name": "Volkswagen"},
				{id: 45, "name": "Volvo"},
				{id: 46, "name": "Прочее"},
			]
		};

		this.onChange = this.onChange.bind(this);
	}


	onChange (search) { this.setState({ search }); }


	get mark () {
		const search = this.state.search.toLowerCase();
		return this.state.autoMark.filter(({name}) => name.toLowerCase().indexOf(search) > -1);
	}

	render() {

		let {id, go, fetchedUser, ...props} = this.props;

		return (
			<Panel id={id}>
				<PanelHeader noShadow>Выберите марку</PanelHeader>
				<FixedLayout vertical="top">
				<Search value={this.state.search} onChange={this.onChange}/>
				</FixedLayout>
				<Group>
					{this.state.autoMark.length > 0 &&
					<List>
						{this.mark.map((mark) => <Cell
							onClick={() => {
								props.сhangeMark(mark.name);
								props.setActivePanel("home")
							}}
							asideContent={props.field2 === mark.name ? <Icon24Done fill="var(--accent)"/> : null}
							key={mark.id}
						>
							{mark.name}
						</Cell>)}
					</List>
					}
				</Group>

			</Panel>)
	}
}


SearchMark.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
	field2: PropTypes.string.isRequired,
	setActivePanel: PropTypes.func.isRequired,
	сhangeMark: PropTypes.func.isRequired,
};

export default SearchMark;
