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
        Schema::create('validations', function (Blueprint $table) {
            $table->id();
            $table->string('form_id');
            $table->foreignId('record_id')
                ->constrained('growth_records')
                ->cascadeOnDelete();

            $table->enum('status', ['Valid', 'Invalid'])->nullable();
            $table->text('note')->nullable();

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
        Schema::dropIfExists('validations');
    }
};
