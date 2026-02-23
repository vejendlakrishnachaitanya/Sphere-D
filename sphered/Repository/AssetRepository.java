package com.fareye.sphered.Repository;

import com.fareye.sphered.Entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByActiveTrue();
    List<Asset> findByOwnerId(Long ownerId);

    // Use a standard query without @Lock
    Optional<Asset> findFirstByAssetTypeAndStatusAndActiveTrue(
            String assetType,
            String status
    );
}