package com.fareye.sphered.Service.Impl;

import com.fareye.sphered.Entity.Asset;
import com.fareye.sphered.Entity.Booking;
import com.fareye.sphered.Entity.Request;
import com.fareye.sphered.Entity.User;
import com.fareye.sphered.Enum.AssetStatus;
import com.fareye.sphered.Enum.RequestStatus;
import com.fareye.sphered.Repository.AssetRepository;
import com.fareye.sphered.Repository.BookingRepository;
import com.fareye.sphered.Repository.RequestRepository;
import com.fareye.sphered.Repository.UserRepository;
import com.fareye.sphered.Service.RequestService;
import com.fareye.sphered.exception.BadRequestException;
import com.fareye.sphered.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class RequestServiceImpl implements RequestService {

    private final RequestRepository requestRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final AssetRepository assetRepository;

    public RequestServiceImpl(RequestRepository requestRepository,
                              UserRepository userRepository,
                              BookingRepository bookingRepository,
                              AssetRepository assetRepository) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
        this.assetRepository = assetRepository;
    }

    @Override
    public Request createDraftRequest(Long userId, String itemType, LocalDate requestedDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        List<Booking> userBookings = bookingRepository.findByUserId(userId);
        boolean hasBooking = userBookings.stream()
                .anyMatch(b -> b.getBookingDate().equals(requestedDate));

        if (!hasBooking) {
            throw new BadRequestException("Request denied: You must have a seat booked for " + requestedDate + " to request an asset.");
        }

        Request request = new Request();
        request.setUser(user);
        request.setItemType(itemType);
        request.setRequestedDate(requestedDate);
        request.setStatus(RequestStatus.DRAFT);

        return requestRepository.save(request);
    }

    @Override
    public Request submitRequest(Long requestId) {
        Request request = getRequest(requestId);
        if (request.getStatus() != RequestStatus.DRAFT) {
            throw new BadRequestException("Only draft requests can be submitted");
        }
        request.setStatus(RequestStatus.SUBMITTED);
        return requestRepository.save(request);
    }

    @Override
    public Request approveRequest(Long requestId) {
        Request request = getRequest(requestId);
        if (request.getStatus() != RequestStatus.SUBMITTED) {
            throw new BadRequestException("Request must be submitted first");
        }
        request.setStatus(RequestStatus.APPROVED);
        return requestRepository.save(request);
    }

    @Override
    @Transactional // Ensures atomic updates
    public Request assignRequest(Long requestId) {
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));

        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new BadRequestException("Request must be approved first");
        }

        Asset asset = assetRepository.findFirstByAssetTypeAndStatusAndActiveTrue(
                request.getItemType(),
                "AVAILABLE"
        ).orElseThrow(() -> new ResourceNotFoundException("No available asset found for type: " + request.getItemType()));

        asset.setOwner(request.getUser());
        asset.setStatus("ASSIGNED");
        assetRepository.save(asset);

        request.setStatus(RequestStatus.ASSIGNED);
        return requestRepository.save(request);
    }

    @Override
    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    private Request getRequest(Long id) {
        return requestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found"));
    }
    @Override
    @Transactional // CRITICAL: Ensures the update is atomic
    public Request rejectRequest(Long requestId) {
        // 1. Fetch the specific record by ID to ensure we are updating, not inserting
        Request request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found with id: " + requestId));

        // 2. Validate current status
        if (request.getStatus() != RequestStatus.SUBMITTED) {
            throw new BadRequestException("Only pending submitted requests can be rejected. Current status: " + request.getStatus());
        }

        // 3. SET STATUS
        request.setStatus(RequestStatus.REJECTED);

        // 4. SAVE
        try {
            return requestRepository.save(request);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            // This catches the "Unique Constraint Error" specifically during the save
            throw new BadRequestException("Database Conflict: A rejected request for this item/user might already exist for this date.");
        }
    }
    @Override
    public Page<Request> getAllRequestsPaged(int page, int size) {
        return requestRepository.findAll(PageRequest.of(page, size, Sort.by("id").descending()));
    }

    @Override
    public Page<Request> getUserRequestsPaged(Long userId, int page, int size) {
        // Note: You may need a custom query in repository if using EAGER fetching
        return requestRepository.findByUserId(userId, PageRequest.of(page, size, Sort.by("id").descending()));
    }
    @Override
    public Page<Request> getQueueRequests(int page, int size) {
        // This fetches active workflow requests (SUBMITTED or APPROVED)
        return requestRepository.findByStatusIn(
                List.of(RequestStatus.SUBMITTED, RequestStatus.APPROVED),
                PageRequest.of(page, size, Sort.by("id").descending())
        );
    }
    @Override
    public Page<Request> getHistoryRequests(int page, int size) {
        // This fetches only completed requests (ASSIGNED or REJECTED)
        return requestRepository.findByStatusIn(
                List.of(RequestStatus.ASSIGNED, RequestStatus.REJECTED),
                PageRequest.of(page, size, Sort.by("id").descending())
        );
    }
}