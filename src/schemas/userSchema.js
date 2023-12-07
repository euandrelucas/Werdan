const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const EmployeeSchema = new Schema({
	type: String,
	salary: Number,
	name: String,
	gender: String,
	age: Number,
	status: String,
});

const BusinessSchema = new Schema({
	name: String,
	cnpj: String,
	type: String,
	creationDate: Date,
	employees: [EmployeeSchema],
	totalIncome: Number,
	dividends: Number,
	bank: 'String',
});

const UserSchema = new Schema({
	_id: ObjectId,
	username: String,
	tag: String,
	id: String,
	date: Date,
	businesses: [BusinessSchema],
});

module.exports = mongoose.model('User', UserSchema);
