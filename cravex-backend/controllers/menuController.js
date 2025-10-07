import { Menu } from '../models/Menu.js';
import express from 'express';
import {MenuItems} from '../utils/menudata.js';


// GET all menu items
export const getMenu = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST new menu item
export const addMenuItem = async (req, res) => {
  try {
    const newItem = new Menu(req.body);
    await newItem.save();
    res.json(newItem);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT update menu item by ID
export const updateMenuItem = async (req, res) => {
  try {
    const updated = await Menu.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE menu item by ID
export const deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
