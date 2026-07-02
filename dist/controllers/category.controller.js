"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryController = void 0;
const create_category_dto_1 = require("../dto/category/create-category.dto");
const update_category_dto_1 = require("../dto/category/update-category.dto");
class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    /**
     * List all categories.
     */
    list = async (_req, res, next) => {
        try {
            const categories = await this.categoryService.listCategories();
            return res.status(200).json({
                success: true,
                data: categories,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Retrieve one category.
     */
    getById = async (req, res, next) => {
        try {
            const category = await this.categoryService.getCategoryById(Number(req.params.id));
            return res.status(200).json({
                success: true,
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Create a category.
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
            const dto = new create_category_dto_1.CreateCategoryDto(req.body.name, req.body.description ?? null);
            const category = await this.categoryService.createCategory(dto, authenticatedUser.userId);
            return res.status(201).json({
                success: true,
                message: "Category created successfully.",
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Update a category.
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
            const dto = new update_category_dto_1.UpdateCategoryDto(req.body.name, req.body.description);
            const category = await this.categoryService.updateCategory(Number(req.params.id), dto, authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                message: "Category updated successfully.",
                data: category,
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * Delete a category.
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
            const result = await this.categoryService.deleteCategory(Number(req.params.id), authenticatedUser.userId);
            return res.status(200).json({
                success: true,
                message: result.message,
            });
        }
        catch (error) {
            next(error);
        }
    };
}
exports.CategoryController = CategoryController;
