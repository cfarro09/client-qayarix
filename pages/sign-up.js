import React, { useState, useContext, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from 'next/link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import Layout from '../components/layout/layout';
import Alert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import authContext from '../context/auth/authContext'

import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link href="/" as={`${publicRuntimeConfig.staticFolder}/`}>
                <a>Zyxme {new Date().getFullYear()}</a>
            </Link>
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    progress: {
        margin: theme.spacing(3, 'auto', 3),
        display: 'block'
    },
    alert: {
        display: 'inline-flex',
        width: '100%',
        marginTop: theme.spacing(1),
    },
    alertheader: {
        display: 'inline-flex',
        width: '100%',
        marginBottom: theme.spacing(4)
    },

}));

export default function SignUp() {

    const { register, authenticated } = useContext(authContext);

    const classes = useStyles();
    const [isloading, setisloading] = useState(false);
    const [resultrequest, setresultrequest] = useState(null)
    const router = useRouter();

    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            pwd: '',
            usr: ''
        },
        validationSchema: Yup.object({
            email: Yup.string().email('El email no es valido').required('El email es obligatorio'),
            firstname: Yup.string().required('El nombre es obligatorio'),
            usr: Yup.string().required('El usuario es obligatorio'),
            lastname: Yup.string().required('El apellido es obligatorio'),
            pwd: Yup.string().required('El password es obligatorio').min(6, 'El password debe ser menos de 6 caracteres'),
        }),
        onSubmit: async values => {
            register(values, setisloading, setresultrequest);
        }
    });

    useEffect(() => {
        if (authenticated)
            router.push("/", publicRuntimeConfig.staticFolder + "/");
    }, [authenticated]);

   
    return (
        <Layout>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Registrarse
                </Typography>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={formik.handleSubmit}
                >
                    {
                        resultrequest && (
                            <Alert className={classes.alertheader} variant="filled" severity={resultrequest.success ? "success" : "error"}>
                                {resultrequest.msg}
                            </Alert>
                        )
                    }
                    <Grid container  spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="off"
                                name="firstname"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstname"
                                label="Nombre"
                                value={formik.values.firstname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                
                                error={formik.errors.firstname ? true : false}
                                helperText={formik.errors.firstname}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastname"
                                label="Apellidos"
                                name="lastname"
                                autoComplete="off"
                                value={formik.values.lastname}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.errors.lastname ? true : false}
                                helperText={formik.errors.lastname}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                autoComplete='off'
                                id="email"
                                label="Correo"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                                error={formik.errors.email ? true : false}
                                helperText={formik.errors.email}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                autoComplete='off'
                                id="usr"
                                label="Usuario"
                                name="usr"
                                value={formik.values.usr}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                                error={formik.errors.usr ? true : false}
                                helperText={formik.errors.usr}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="pwd"
                                label="Password"
                                autoComplete='off'
                                type="password"
                                id="pwd"
                                autoComplete="current-password"
                                value={formik.values.pwd}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}

                                error={formik.errors.pwd ? true : false}
                                helperText={formik.errors.pwd}
                            />
                            
                        </Grid>
                    </Grid>
                    {
                        !isloading ?
                            (
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                >
                                    Guardar
                                </Button>
                            ) :
                            (
                                <CircularProgress className={classes.progress} />
                            )
                    }
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="/sign-in" as={`${publicRuntimeConfig.staticFolder}/sign-in`}>
                                <a>¿Ya tienes una cuenta? Inicia sesión</a>
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Layout>
    );
}