"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemController = void 0;
const create_item_dto_1 = require("../dto/item/create-item.dto");
const update_item_dto_1 = require("../dto/item/update-item.dto");
class ItemController {
    itemService;
    constructor(itemService) {
        this.itemService = itemService;
    }
    /**
     * List inventory items with optional search and pagination.
     */
    list = async (req, res, next) => {
        try {
            const page = Number(req.query.page ?? 1);
            const limit = Number(req.query.limit ?? 10);
            const search = typeof req.query.search === "string" ? req.query.search : undefined;
            const result = await this.itemService.listItems({ page, limit, search });
            return res.status(200).json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Retrieve a single inventory item.
     */
    getById = async (req, res, next) => {
        try {
            const item = await this.itemService.getItemById(Number(req.params.id));
            return res.status(200).json({
                success: true,
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Create a new inventory item.
     */
    create = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const dto = new create_item_dto_1.CreateItemDto(req.body.sku, req.body.name, req.body.description ?? null, req.body.quantity, req.body.receivedAt, req.body.categoryId);
            const item = await this.itemService.createItem(dto, authenticatedUser.userId);
            return res.status(201).json({
                success: true,
                message: "Item created successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Update an inventory item.
     */
    update = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const dto = new update_item_dto_1.UpdateItemDto(req.body.sku, req.body.name, req.body.description, req.body.quantity, req.body.receivedAt, req.body.categoryId, req.body.isActive);
            const item = await this.itemService.updateItem(Number(req.params.id), dto, authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                message: "Item updated successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Soft delete an inventory item.
     */
    remove = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const item = await this.itemService.deleteItem(Number(req.params.id), authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                message: "Item deleted successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Restore a soft-deleted item.
     */
    restore = async (req, res, next) => {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required.",
                });
            }
            const item = await this.itemService.restoreItem(Number(req.params.id), authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                message: "Item restored successfully.",
                data: item,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.ItemController = ItemController;
