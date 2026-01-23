import { Request, Response } from "express";
import { catchAsync } from "../utils/CatchAsync";
import { matchedData } from "express-validator";
import { RequestService } from "../services/request.service";

export class FormController {
    // Youth Form
    static createYouthForm = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await RequestService.createYouthForm(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllYouthForms = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllYouthForms(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Cell Recommendation
    static createCellRecommendation = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await RequestService.createCellRecommendation(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllCellRecommendations = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllCellRecommendations(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Church Recommendation
    static createChurchRecommendation = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await RequestService.createChurchRecommendation(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllChurchRecommendations = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllChurchRecommendations(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Baptism Certification
    static createBaptismCertification = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        if (data.baptismDate) data.baptismDate = new Date(data.baptismDate);
        const result = await RequestService.createBaptismCertification(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllBaptismCertifications = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllBaptismCertifications(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Marriage Certificate
    static createMarriageCertificate = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await RequestService.createMarriageCertificate(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllMarriageCertificates = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllMarriageCertificates(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Wedding Service Request
    static createWeddingServiceRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        const result = await RequestService.createWeddingServiceRequest(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllWeddingServiceRequests = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllWeddingServiceRequests(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Child Dedication Request
    static createChildDedicationRequest = catchAsync(async (req: Request, res: Response) => {
        const data = matchedData(req);
        if (data.dateOfBirth) data.dateOfBirth = new Date(data.dateOfBirth);
        if (data.dedicationDate) data.dedicationDate = new Date(data.dedicationDate);
        const result = await RequestService.createChildDedicationRequest(data);
        res.status(201).json({ success: true, data: result });
    });

    static getAllChildDedicationRequests = catchAsync(async (req: Request, res: Response) => {
        const { page = 1, limit = 10 } = req.query;
        const { data, total } = await RequestService.getAllChildDedicationRequests(Number(page), Number(limit));
        res.status(200).json({ success: true, data, pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) } });
    });

    // Confirm/Reject forms
    static confirmForm = catchAsync(async (req: Request, res: Response) => {
        const { formType, formId } = req.params;
        const result = await RequestService.confirmForm(formType, formId);
        res.status(200).json({ success: true, data: result, message: 'Form confirmed successfully. Email notification sent.' });
    });

    static rejectForm = catchAsync(async (req: Request, res: Response) => {
        const { formType, formId } = req.params;
        const { reason } = req.body;
        const result = await RequestService.rejectForm(formType, formId, reason);
        res.status(200).json({ success: true, data: result, message: 'Form rejected successfully. Email notification sent.' });
    });
}
