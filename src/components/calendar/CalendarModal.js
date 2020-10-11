import React from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import Modal from 'react-modal';
import DateTimePicker from 'react-datetime-picker';
import Swal from 'sweetalert2';

import { customStyles } from '../../helpers/centerModalStyles';
import { uiCloseModal } from '../../actions/ui';
import { eventAddNew } from '../../actions/calendarEvents';

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const endInit = now.clone().add(1, 'hours')

const intiEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: endInit.toDate()
}

export const CalendarModal = () => {

    const { modalOpen } = useSelector(state => state.ui);
    
    const dispatch = useDispatch();

    // const [dateStart, setDateStart] = useState(now.toDate());
    // const [dateEnd, setDateEnd] = useState(endInit.toDate());
    const [titleValid, setTitleValid] = useState(true)

    const [formValues, setFormValues] = useState( intiEvent );

    const { notes, title, start, end } = formValues;

    const handleInputChange = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        })
    }

    const closeModal = () => {
        dispatch( uiCloseModal() );
        setFormValues( intiEvent )
    }

    const handleEndDate = (e) => {
        // setDateEnd(e)
        setFormValues({
            ...formValues,
            end: e
        })
    }

    const handleStartDate = (e) => {
        // setDateStart(e);
        setFormValues({
            ...formValues,
            start: e
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const momentStart = moment( start );
        const momentEnd = moment( end );

        if ( momentStart.isSameOrAfter( momentEnd ) ){
            Swal.fire('Error', 'La fecha de fin debe ser mayor a la de la inicio')
            return;
        }

        if ( title.trim().length < 2 ) {
           return setTitleValid(false)
        }

        // Realizar grabación base datos
        console.log(formValues);
        dispatch( eventAddNew({
            ...formValues,
            id: new Date().getTime(),
            user: {
                _id: 123,
                name: 'otro'
            }
        }) )

        setTitleValid(true);
        closeModal();
    }

    return (
        <Modal
            isOpen={ modalOpen }
            onRequestClose={ closeModal }
            style={customStyles}
            closeTimeoutMS={200}
            className="modal"
            overlayClassName="modal-fondo"
        >
            <h1> Nuevo evento </h1>
            <hr />
            <form
                className="container"
                onSubmit={handleSubmit}
            >

                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        className="form-control"
                        minDate={now.toDate()}
                        onChange={handleStartDate}
                        value={ formValues.start }
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        className="form-control"
                        onChange={handleEndDate}
                        minDate={ formValues.start }
                        value={ formValues.end }
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={ `form-control ${ !titleValid && 'is-invalid' }` }
                        placeholder="Título del evento"
                        name="title"
                        autoComplete="off"
                        value={title}
                        onChange={handleInputChange}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripción corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        value={notes}
                        onChange={handleInputChange}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Información adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
