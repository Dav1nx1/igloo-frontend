import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableFooter from '@mui/material/TableFooter'
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import Box from '@mui/material/Box'
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Search from '@mui/icons-material/Search';

import router, { useRouter } from 'next/router'
import axios from 'axios';

interface TablePaginationActionsProps {
	count: number;
	page: number;
	rowsPerPage: number;
	onPageChange: (
		event: React.MouseEvent<HTMLButtonElement>,
		newPage: number,
	) => void;
}

interface State {
	userName: string;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>,
    ) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }

function createData(
    name: string,
    username: string,
    email: string,
    address: string,
    city: string,
    id: number,
  ) {
    return { name, username, email, address, city, id };
} 

export default function UsersTable(props) {

	const [page, setPage] = React.useState(0);
  	const [rowsPerPage, setRowsPerPage] = React.useState(5);
	const [values, setValues] = React.useState<State>({ userName: '' }); 

	const [rows, setRows] = React.useState<State>([])


	const fetchUsers = async () => {
		const response = await fetch( 'http://localhost:3000/users');
	
		const json = await response.json();
		setRows(json.map( user => createData(user.name, user.username, user.email, `${user.address.street} - ${user.address.suite}`, user.address.city, user.id) ))
	  }
	
	  React.useEffect( () => {
		fetchUsers()
	  }, [])
	  
	const handleChange =
    (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleSearchInput = async (event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>) => {
	const searchTerm = event.target.value
	if (searchTerm.length >= 3) {
		const response = await axios.post('http://localhost:3000/users/search', { name: searchTerm })
		const data = await response.data
		setRows(data.map( user => createData(user.name, user.username, user.email, `${user.address.street} - ${user.address.suite}`, user.address.city, user.id) ))
	}
	if (searchTerm.length < 3) {
		fetchUsers()
	}
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleClick = (userId:number) =>  {
    router.push(`/users/${userId}`)
  } 


  return (
		<>
			<section className="filters-section py-5">
				<FormControl sx={{ m: 2, width: '35ch' }} variant="outlined" data-testid="search-section">
						<InputLabel htmlFor="outlined-adornment-user">Search</InputLabel>
						<OutlinedInput
							onKeyUp={ (event) => handleSearchInput(event)}
							id="outlined-adornment-user"
							type='text'
							// onChange={}
							endAdornment={
								<InputAdornment position="end">
									<IconButton
										aria-label="search user"
										edge="end"
									>
										<Search />
									</IconButton>
								</InputAdornment>
							}
							label="Password"
						/>
					</FormControl>
			</section>
			<TableContainer component={Paper} sx={{ maxHeight: 640 }} data-testid="table-section">
				<Table stickyHeader sx={{ minWidth: 500 }} aria-label="custom pagination table">
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align="right">Username</TableCell>
							<TableCell align="right">Email&nbsp;</TableCell>
							<TableCell align="right">Address</TableCell>
							<TableCell align="right">City&nbsp;</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(rowsPerPage > 0
							? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							: rows
						).map((row) => (
							<TableRow key={row.name} onClick={(event) => handleClick(event.target.id)} id={row.id}>
								<TableCell component="th" scope="row" id={row.id}>
									{row.name}
								</TableCell>
								<TableCell style={{ width: 160 }} align="right">
									{row.username}
								</TableCell>
								<TableCell style={{ width: 160 }} align="right">
									{row.email}
								</TableCell>
								<TableCell style={{ width: 160 }} align="right">
									{row.address}
								</TableCell>
								<TableCell style={{ width: 160 }} align="right">
									{row.city}
								</TableCell>
							</TableRow>
						))}
						{emptyRows > 0 && (
							<TableRow style={{ height: 53 * emptyRows }}>
								<TableCell colSpan={6} />
							</TableRow>
						)}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
								colSpan={5}
								count={rows.length}
								rowsPerPage={rowsPerPage}
								page={page}
								SelectProps={{
									inputProps: {
										'aria-label': 'rows per page',
									},
									native: true,
								}}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</>
  )
}
