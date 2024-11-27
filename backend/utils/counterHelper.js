const CounterHelper = require('../models/counter')

async function getNextSequenceValue(key) {
	const counter = await CounterHelper.findOneAndUpdate(
		{ key }, // Match the key (e.g., 'memberNumber')
		{ $inc: { count: 1 } }, // Increment the counter
		{ new: true, upsert: true } // Create the document if it doesn't exist
	);
	return counter.count;
}

module.exports = { getNextSequenceValue }