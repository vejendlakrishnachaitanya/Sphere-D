package com.fareye.sphered.Repository;

import com.fareye.sphered.Entity.Request;
import com.fareye.sphered.Entity.User;
import com.fareye.sphered.Enum.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface RequestRepository extends JpaRepository<Request, Long> {

    boolean existsByUserAndItemTypeAndStatus(
            User user,
            String itemType,
            RequestStatus status
    );
    Page<Request> findAll(Pageable pageable);
    Page<Request> findByUserId(Long userId, Pageable pageable);
    long countByStatus(RequestStatus status);
    List<Request> findByUserAndItemTypeAndRequestedDate(User user, String itemType, LocalDate requestedDate);
    Page<Request> findByStatusIn(List<RequestStatus> statuses, Pageable pageable);
}