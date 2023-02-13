const MessageModel = require("../model/MessageModel");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createMsg = async (req, res) => {
  try {
    // console.log(req.body);
    const { from, to, message } = req.body;
    const data = await MessageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      return res.status(StatusCodes.OK).json({msg: "message added successfully"});
    }
  } catch (error) {
    return res.json({ msg: "failed to add message" });
  }
};

const getMsg = async (req, res) => {
  // console.log(req.body);
  try {
    const {from, to} = req.body
    const messages = await MessageModel.find({
        users: {
            $all: [from, to],
        },
    }).sort({updatedAt: 1})
    const projectMessages = messages.map(msg => {
        return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text
        }
    })
    res.status(StatusCodes.OK).json({projectMessages})
    
  } catch (error) {
    return res.json({ msg: "failed to get messages" });
  }
};

module.exports = { createMsg, getMsg };
