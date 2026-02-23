package com.fareye.sphered.Service;
import com.fareye.sphered.Entity.Request;
import org.springframework.data.domain.Page;

import java.time.LocalDate;
import java.util.List;

public interface RequestService {

    Request createDraftRequest(Long userId, String itemType, LocalDate requestDate);

    Request submitRequest(Long requestId);

    Request approveRequest(Long requestId);

    Request assignRequest(Long requestId);

    List<Request> getAllRequests();

    Request rejectRequest(Long requestId);

    Page<Request> getAllRequestsPaged(int page, int size);

    Page<Request> getUserRequestsPaged(Long userId, int page, int size);
    Page<Request> getQueueRequests(int page, int size);
    Page<Request> getHistoryRequests(int page, int size);
}
