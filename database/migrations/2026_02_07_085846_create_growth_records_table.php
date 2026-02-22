<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('growth_records', function (Blueprint $table) {
            $table->id();
            $table->string('form_id');
            $table->foreignId('child_id')->constrained('children')->cascadeOnDelete();

            $table->string('month')->nullable();
            $table->string('year')->nullable();
            $table->integer('age_months')->nullable();

            $table->decimal('weight', 5, 2)->nullable();
            $table->decimal('height', 6, 2)->nullable();

            $table->string('nutrition_status')->nullable();
            $table->timestamps();

            $table->foreign('form_id')
                ->references('form_id')
                ->on('forms')
                ->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('growth_records');
    }
};
