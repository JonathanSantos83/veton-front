import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import { CircularProgress, Container, Grid } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import NavigateNextOutlined from "@material-ui/icons/NavigateNextOutlined";
import NavigateBeforeOutlined from "@material-ui/icons/NavigateBeforeOutlined";
import { MuiPickersUtilsProvider, KeyboardDatePicker  } from "@material-ui/pickers";
import AppointmentList from "../AppointmentList";
import { Api } from "../../../Services";
import "moment/locale/es";
import useStyles from "./styles";

moment.locale("es");

const ONE_DAY = 1;
const DAYS = "days";

const AppointmentListWithDate = ({ idVet }) => {
  const classes = useStyles();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false)

  useEffect(() => {
    const date = moment(selectedDate).format("YYYY-MM-DD");
    getAppointmentsByDate(date);
  // eslint-disable-next-line
  }, [selectedDate]);

  /**
   * Method to handle before day, set selected day and the effect call api to get appointments
   * @returns {void}
   */
  const handleBeforeDay = () => {
    const dateBefore = moment(selectedDate).subtract(ONE_DAY, DAYS);
    setSelectedDate(dateBefore);
  };

  /**
   * Method to handle next day, set selected day and the effect call api to get appointments
   * @returns {void}
   */
  const handleNextDay = () => {
    const dateNext = moment(selectedDate).add(ONE_DAY, DAYS);
    console.log(dateNext);
    setSelectedDate(dateNext);
  };

   /**
   * Method to handle  day, set selected day and the effect call api to get appointments
   * @returns {void}
   */
  const handleDateCalendar = (d) => {

    setShowDatePicker(!showDatePicker);
     setSelectedDate(d);
  };


  /**
   * Method to fetch appointments by date by vet
   * @param {date} date
   * @returns {Promise}
   */
  const getAppointmentsByDate = async date => {
    try {
      setLoading(true);
      const { data } = await Api.appointments.fetchByVet(idVet, date);
      if (data.success) {
        setAppointments(data.data);
        setError(null);
      } else {
        setError("Se produjo un error al obtener los turnos del día");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Se produjo un error al obtener los turnos del día");
    }
  };

  return (
    <>
      <h2 className={classes.title}>Turnos del día de hoy</h2>
      <div className={classes.ctnDateSelection}>
        <IconButton aria-label="before" className={classes.icons} onClick={handleBeforeDay}>
          <NavigateBeforeOutlined />
        </IconButton> 
        <IconButton aria-label="select date" className={classes.icons2} onClick={() => setShowDatePicker(!showDatePicker)}><p className={classes.date} style={{ userSelect: "none" }}>
         { showDatePicker ? "Cerrar calendario" : moment(selectedDate).format("LL")} 
        </p></IconButton> 
        <IconButton aria-label="after" className={classes.icons} onClick={handleNextDay}>
          <NavigateNextOutlined />
        </IconButton>
        {showDatePicker && 
        <div className={classes.datePicker}>
          <MuiPickersUtilsProvider utils={MomentUtils}  > 
              <KeyboardDatePicker 
              autoOk
             orientation="portrait"
              variant="static"
                margin="normal"
                id="date-picker-dialog"
                label="Date picker dialog"
                value={selectedDate}
                onChange={handleDateCalendar}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
      </MuiPickersUtilsProvider>    
        </div>
                      
        }
        
      </div>
      <div className={classes.listHours}>
        {!loading && appointments.length > 0 && <AppointmentList appointments={appointments} showDate={false} />}
        {loading && (
          <Container fixed>
            <Grid container alignItems="center" className={classes.spinner} direction="row" justify="center">
              <CircularProgress color="secondary" />
            </Grid>
          </Container>
        )}
        {!loading && error && <p>{error}</p>}
        {!loading && !error && appointments.length === 0 && <p>Sin turnos</p>}
      </div>
    </>
  );
};

AppointmentListWithDate.propTypes = {
  idVet: PropTypes.number.isRequired,
};

export default AppointmentListWithDate;
