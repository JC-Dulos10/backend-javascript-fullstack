import { NextFunction, Request, Response } from "express";

import { CreateCategoryDto } from "../dto/category/create-category.dto";
import { UpdateCategoryDto } from "../dto/category/update-category.dto";
import { JwtPayload } from "../security/auth.types";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * List all categories.
   */
  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const categories = await this.categoryService.listCategories();

      return res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Retrieve one category.
   */
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const category = await this.categoryService.getCategoryById(Number(req.params.id));

      return res.status(200).json({
        success: true,
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a category.
   */
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as Request & { user?: JwtPayload }).user;

      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: "Authentication token is required.",
        });
      }

      const dto = new CreateCategoryDto(req.body.name, req.body.description ?? null);
      const category = await this.categoryService.createCategory(dto, authenticatedUser.userId);

      return res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update a category.
   */
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as Request & { user?: JwtPayload }).user;

      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: "Authentication token is required.",
        });
      }

      const dto = new UpdateCategoryDto(req.body.name, req.body.description);
      const category = await this.categoryService.updateCategory(Number(req.params.id), dto, authenticatedUser.userId);

      return res.status(200).json({
        success: true,
        message: "Category updated successfully.",
        data: category,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a category.
   */
  remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authenticatedUser = (req as Request & { user?: JwtPayload }).user;

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
    } catch (error) {
      next(error);
    }
  };
}
