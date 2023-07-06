import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { BasketItem } from '../../app/models/basket';
import BasketTable from '../basket/BasketTable';
import { currencyFormat } from '../../app/util/util';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Order } from '../../app/models/order';
import agent from '../../app/api/agent';
import LoadingComponent from '../../app/layout/LoadingComponent';

export default function OrderDetails() {
    const {id} = useParams<{id: string}>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            agent.Orders.fetch(parseInt(id))
                .then(order => setOrder(order))
                .catch(error => console.log(error))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <LoadingComponent message='Loading order...' />

    return (
        <>
            <Typography variant="h5" gutterBottom>
                Order #{order!.id} - {order!.orderStatus}
            </Typography>
            <Button component={Link} to='/orders'>Back to Orders</Button>
            <BasketTable items={order!.orderItems as BasketItem[]} isBasket={false} />
            <Grid container>
                <Grid item xs={6} />
                <Grid item xs={6}>
                    <TableContainer component={Paper} variant={'outlined'}>
                        <Table>
                            <TableBody>
                                <TableRow>
                                    <TableCell colSpan={2}>Subtotal</TableCell>
                                    <TableCell align="right">{currencyFormat(order!.subtotal)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2}>Delivery fee*</TableCell>
                                    <TableCell align="right">{currencyFormat(order!.deliveryFee)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2}>Total</TableCell>
                                    <TableCell align="right">{currencyFormat(order!.total)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>
                                        <span style={{ fontStyle: 'italic' }}>*Orders over $100 qualify for free delivery</span>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </>
    )
}