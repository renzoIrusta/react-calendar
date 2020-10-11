
import moment from 'moment';
import { types } from '../types/types';

const initialState = {
    events: [{
        title: 'Cumpleaños de la jefecita',
        start: moment().toDate(),
        end: moment().add(2, 'hours').toDate(),
        bgcolor: '#fafafa',
        notes: 'comprar el pastel',
        user: {
            id: '123',
            name: 'Renzo'
        }
    }
    ],
    activeEvent: null
}

export const calendarReducer = (state = initialState, action) => {

    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload
            }
        case types.eventAddNew:
            return {
                ...state,
                events: [ action.payload, ...state.events ],
            }

        default:
            return state;
    }

}