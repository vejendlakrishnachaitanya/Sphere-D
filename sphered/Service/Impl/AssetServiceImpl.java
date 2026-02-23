package com.fareye.sphered.Service.Impl;

import com.fareye.sphered.Entity.Asset;
import com.fareye.sphered.Entity.Request;
import com.fareye.sphered.Entity.User;
import com.fareye.sphered.Enum.AssetStatus; // Added for type safety
import com.fareye.sphered.Enum.RequestStatus;
import com.fareye.sphered.Repository.AssetRepository;
import com.fareye.sphered.Repository.RequestRepository;
import com.fareye.sphered.Repository.UserRepository;
import com.fareye.sphered.Service.AssetService;
import com.fareye.sphered.exception.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final RequestRepository requestRepository;
    private final UserRepository userRepository;

    public AssetServiceImpl(AssetRepository assetRepository,
                            RequestRepository requestRepository,
                            UserRepository userRepository) {
        this.assetRepository = assetRepository;
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public Asset createAsset(Asset asset) {
        long quantity = asset.getTotalItems();
        Asset lastCreated = null;

        for (int i = 1; i <= quantity; i++) {
            Asset singleAsset = new Asset();
            singleAsset.setAssetType(asset.getAssetType());

            // Use UUID to ensure absolute uniqueness for every record
            String uniqueSn = asset.getSerialNumber() + "-" +
                    java.util.UUID.randomUUID().toString().substring(0, 8) + "-" + i;
            singleAsset.setSerialNumber(uniqueSn);

            singleAsset.setStatus(AssetStatus.AVAILABLE.name());
            singleAsset.setActive(true);
            lastCreated = assetRepository.save(singleAsset);
        }
        return lastCreated;
    }

    @Override
    public List<Asset> getAllActiveAssets() {
        return assetRepository.findAll()
                .stream()
                .filter(Asset::isActive)
                .toList();
    }

    @Override
    public Asset updateAsset(Long id, Asset asset) {
        Asset existing = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));

        existing.setSerialNumber(asset.getSerialNumber());
        existing.setAssetType(asset.getAssetType());
        existing.setStatus(asset.getStatus());
        existing.setTotalItems(asset.getTotalItems());

        return assetRepository.save(existing);
    }

    @Override
    public void softDeleteAsset(Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + id));
        asset.setActive(false);
        assetRepository.save(asset);
    }


    @Override
    @Transactional
    public Asset markAssetBroken(Long assetId, Long userId) {

        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // SECURITY CHECK
        if (asset.getOwner() == null || !asset.getOwner().getId().equals(userId)) {
            throw new RuntimeException("This asset does not belong to the user");
        }

        // mark asset broken
        asset.setStatus(AssetStatus.BROKEN.name());

        Asset savedAsset = assetRepository.save(asset);

        // ALWAYS create replacement request
        Request request = new Request();

        request.setUser(user);
        request.setItemType(asset.getAssetType());
        request.setRequestedDate(LocalDate.now());

        // send directly to IT team
        request.setStatus(RequestStatus.SUBMITTED);

        requestRepository.save(request);

        return savedAsset;
    }

    public List<Asset> getAssetsByUser(Long userId) {
        return assetRepository.findByOwnerId(userId)
                .stream()
                .filter(Asset::isActive)
                .toList();
    }

    @Override
    @Transactional
    public Asset assignAssetToUser(Long assetId, Long userId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset not found with id: " + assetId));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        asset.setOwner(user);
        asset.setStatus(AssetStatus.ASSIGNED.name());

        return assetRepository.save(asset);
    }
}