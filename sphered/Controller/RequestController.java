package com.fareye.sphered.Controller;

import com.fareye.sphered.Entity.Request;
import com.fareye.sphered.Enum.RequestStatus;
import com.fareye.sphered.Service.RequestService;
import com.fareye.sphered.Repository.RequestRepository;

import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin("*")
public class RequestController {

    private final RequestService requestService;
    private final RequestRepository requestRepository;

    public RequestController(RequestService requestService,
                             RequestRepository requestRepository) {
        this.requestService = requestService;
        this.requestRepository = requestRepository;
    }

    // UPDATED: Create Draft Request with Quantity
    @PostMapping("/draft")
    public Request createDraft(
            @RequestParam Long userId,
            @RequestParam String itemType,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate requestedDate,
            @RequestParam Integer quantity) {
        return requestService.createDraftRequest(userId, itemType, requestedDate, quantity);
    }

    // Submit Request
    @PutMapping("/{id}/submit")
    public Request submit(@PathVariable Long id) {
        return requestService.submitRequest(id);
    }

    // Approve Request
    @PutMapping("/{id}/approve")
    public Request approve(@PathVariable Long id) {
        return requestService.approveRequest(id);
    }

    // Reject Request
    @PutMapping("/{id}/reject")
    public Request reject(@PathVariable Long id) {
        return requestService.rejectRequest(id);
    }

    // Assign Request
    @PutMapping("/{id}/assign")
    public Request assign(@PathVariable Long id) {
        return requestService.assignRequest(id);
    }

    // Get All Requests
    @GetMapping
    public List<Request> getAll() {
        return requestService.getAllRequests();
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long draft = requestRepository.countByStatus(RequestStatus.DRAFT);
        long submitted = requestRepository.countByStatus(RequestStatus.SUBMITTED);
        long approved = requestRepository.countByStatus(RequestStatus.APPROVED);
        long assigned = requestRepository.countByStatus(RequestStatus.ASSIGNED);
        long rejected = requestRepository.countByStatus(RequestStatus.REJECTED);

        return ResponseEntity.ok(new Object() {
            public final long draftRequests = draft;
            public final long submittedRequests = submitted;
            public final long approvedRequests = approved;
            public final long assignedRequests = assigned;
            public final long rejectedRequests = rejected;
        });
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<Request>> getPagedRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(requestService.getAllRequestsPaged(page, size));
    }

    @GetMapping("/user/{userId}/paged")
    public ResponseEntity<Page<Request>> getPagedUserRequests(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(requestService.getUserRequestsPaged(userId, page, size));
    }

    @GetMapping("/queue/paged")
    public ResponseEntity<Page<Request>> getQueueRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(requestService.getQueueRequests(page, size));
    }

    @GetMapping("/history/paged")
    public ResponseEntity<Page<Request>> getHistoryRequests(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(requestService.getHistoryRequests(page, size));
    }
}