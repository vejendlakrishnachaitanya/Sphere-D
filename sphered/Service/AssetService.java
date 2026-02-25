package com.fareye.sphered.Service;

import com.fareye.sphered.Entity.Asset;

import java.util.List;

public interface AssetService {

    Asset createAsset(Asset asset);

    List<Asset> getAllActiveAssets();

    Asset updateAsset(Long id, Asset asset);

    void softDeleteAsset(Long id);

    Asset markAssetBroken(Long assetId, Long userId);

    List<Asset> getAssetsByUser(Long userId);

    Asset assignAssetToUser(Long assetId, Long userId);
}