import React from 'react'
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik'
import {useDispatch, useSelector} from 'react-redux'
import {loginTC} from './auth-reducer'
import {RootStateType, DispatchType} from '../../app/store'
import {Redirect} from 'react-router-dom'

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}
type FormValuesType = {
    email: string,
    password: string,
    rememberMe: boolean
}

export const Login = () => {
    const dispatch = useDispatch<DispatchType>()
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        // triggers validation on each typed character
        validate: values => {
            const errors: FormikErrorType = {}
            // errors for email field
            if (!values.email) {
                errors.email = 'Email is required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            // errors for password field
            if (!values.password) {
                errors.password = 'Password is required'
            } else if (values.password.length < 4) {
                errors.password = 'Password must be at least 4 characters'
            }
            return errors
        },
        // form tag's handleSubmit references this callback; it receives field values
        // as an object {fieldName: entered value, ...}
        onSubmit: async (values: FormValuesType, formikHelpers: FormikHelpers<FormValuesType>) => {
            const action = await dispatch(loginTC(values))
            debugger
            if (loginTC.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        }
    })
    // if logged in and on login page, redirect to main page
    const isLoggedIn = useSelector<RootStateType, boolean>(state => state.auth.isLoggedIn)
    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }
    return <Grid container justify="center">
        <Grid item xs={4}>
            <form onSubmit={formik.handleSubmit}>
                <FormControl>
                    <FormLabel>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}
                               rel="noopener noreferrer">here
                            </a>
                        </p>
                        <p>or use common test account credentials:</p>
                        <p>Email: free@samuraijs.com</p>
                        <p>Password: free</p>
                    </FormLabel>
                    <FormGroup>
                        <TextField
                          label="Email"
                          margin="normal"
                          {...formik.getFieldProps('email')}
                        />
                        {formik.errors.email ? <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                          type="password"
                          label="Password"
                          margin="normal"
                          {...formik.getFieldProps('password')}
                        />
                        {formik.errors.password ? <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                          label={'Remember me'}
                          control={<Checkbox {...formik.getFieldProps('rememberMe')}
                                             checked={formik.values.rememberMe}/>}
                        />
                        <Button type={'submit'} variant={'contained'} color={'primary'}>Login</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
