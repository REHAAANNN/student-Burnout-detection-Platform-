const express = require('express')
const router = express.Router()
const { createEntry, getEntries, deleteEntry } = require('../controllers/journalController')

router.post('/', createEntry)
router.get('/:userId', getEntries)
router.delete('/:id', deleteEntry)

module.exports = router
