package com.fareye.sphered.Controller;

import com.fareye.sphered.Entity.Asset;
import com.fareye.sphered.Service.AssetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@CrossOrigin(origins = "*")
public class AssetController {
    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @PostMapping
    public ResponseEntity<Asset> createAsset(@Valid @RequestBody Asset asset) {
        Asset created = assetService.createAsset(asset);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getActiveAssets() {
        return ResponseEntity.ok(assetService.getAllActiveAssets());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Asset> updateAsset(
            @PathVariable Long id,
            @Valid @RequestBody Asset asset) {

        return ResponseEntity.ok(assetService.updateAsset(id, asset));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void softDelete(@PathVariable Long id) {
        assetService.softDeleteAsset(id);
    }
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Asset>> getAssetsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(assetService.getAssetsByUser(userId));
    }

    @PutMapping("/{id}/broken/{userId}")
    public ResponseEntity<Asset> markBroken(
            @PathVariable Long id,
            @PathVariable Long userId) {

        Asset updatedAsset = assetService.markAssetBroken(id, userId);

        return ResponseEntity.ok(updatedAsset);
    }
    @PutMapping("/{assetId}/assign/{userId}")
    public ResponseEntity<Asset> assignAssetToUser(
            @PathVariable Long assetId,
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                assetService.assignAssetToUser(assetId, userId)
        );
    }
    @GetMapping("/stats")
    public ResponseEntity<?> getAssetStats() {

        List<Asset> assets = assetService.getAllActiveAssets();

        long total = assets.size();

        long available = assets.stream()
                .filter(a -> "AVAILABLE".equals(a.getStatus()))
                .count();

        long assigned = assets.stream()
                .filter(a -> "ASSIGNED".equals(a.getStatus()))
                .count();

        long broken = assets.stream()
                .filter(a -> "BROKEN".equals(a.getStatus()))
                .count();

        return ResponseEntity.ok(
                new Object() {
                    public final long totalAssets = total;
                    public final long availableAssets = available;
                    public final long assignedAssets = assigned;
                    public final long brokenAssets = broken;
                }
        );
    }
}