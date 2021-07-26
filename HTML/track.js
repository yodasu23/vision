/**
* Recursive version of Euclidean Algorithm of finding greatest common divisor (GCD).
* @param {number} originalA
* @param {number} originalB
* @return {number}
*/
export function euclideanAlgorithm(originalA, originalB) {
    // Make input numbers positive.
    const a = Math.abs(originalA);
    const b = Math.abs(originalB);

    // To make algorithm work faster instead of subtracting one number from the other
    // we may use modulo operation.
    return (b === 0) ? a : euclideanAlgorithm(b, a % b);
}


/**
* tracker
*/
export function EuclideanDistTracker() {
    var center_points = {};
    var id_count = 0;

    this.update = function (self, objects_rect) {
        //Objects boxes and ids
        objects_bbs_ids = []
        $.each(objects_rect, function (item, index) {
            let x, y, w, h = item;
            let cx = (x + x + w) // 2
            let cy = (y + y + h) // 2

            //Find out if that object was detected already
            let same_object_detected = False
            $.each(objects_rect, function (points, index_rect) {

            });
        });

    }

    this.getCount = function () {
        return id_count;
    }
}