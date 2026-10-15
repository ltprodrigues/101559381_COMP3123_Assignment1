const Employee = require('../models/Employee');
const logger = require('../utils/logger');

const createEmployee = async (request, response, next) => {
    try {
        const {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        } = request.body;

        const employee = await Employee.create({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department,
            user: request.user._id
        });

        return response.status(201).json({
            status: 'success',
            message: 'Employee created successfully',
            employee
        });
    } catch (error) {
        next(error);
    }
};

const getEmployees = async (request, response, next) => {
    try {
        const employees = await Employee.find({
            user: request.user._id
        });

        return response.status(200).json({
            status: 'success',
            count: employees.length,
            employees
        });
    } catch (error) {
        next(error);
    }
};

const getEmployeeById = async (request, response, next) => {
    try {
        const employee = await Employee.findById(request.params.eid);

        if (!employee) {
            return response.status(404).json({
                status: 'error',
                message: 'Employee not found'
            });
        }

        if (!employee.user.equals(request.user._id)) {
            logger.warn('Employee ownership denied', {
                userId: request.user._id.toString(),
                employeeId: employee._id.toString(),
                method: request.method,
                path: request.path
            });

            return response.status(403).json({
                status: 'error',
                message: 'You cannot access this employee'
            });
        }

        return response.status(200).json({
            status: 'success',
            employee
        });
    } catch (error) {
        next(error);
    }
};
const updateEmployee = async (request, response, next) => {
    try {
        const employee = await Employee.findById(request.params.eid);

        if (!employee) {
            return response.status(404).json({
                status: 'error',
                message: 'Employee not found'
            });
        }

        if (!employee.user.equals(request.user._id)) {
            logger.warn('Employee ownership denied', {
                userId: request.user._id.toString(),
                employeeId: employee._id.toString(),
                method: request.method,
                path: request.path
            });

            return response.status(403).json({
                status: 'error',
                message: 'You cannot update this employee'
            });
        }

        const {
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        } = request.body;

        employee.set({
            first_name,
            last_name,
            email,
            position,
            salary,
            date_of_joining,
            department
        });

        await employee.save();

        return response.status(200).json({
            status: 'success',
            message: 'Employee updated successfully',
            employee
        });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (request, response, next) => {
    try {
        const employee = await Employee.findById(request.query.eid);

        if (!employee) {
            return response.status(404).json({
                status: 'error',
                message: 'Employee not found'
            });
        }

        if (!employee.user.equals(request.user._id)) {
            logger.warn('Employee ownership denied', {
                userId: request.user._id.toString(),
                employeeId: employee._id.toString(),
                method: request.method,
                path: request.path
            });
            
            return response.status(403).json({
                status: 'error',
                message: 'You cannot delete this employee'
            });
        }

        await Employee.deleteOne({
            _id: employee._id,
            user: request.user._id
        });

        return response.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = { createEmployee, getEmployees, getEmployeeById, updateEmployee, deleteEmployee };